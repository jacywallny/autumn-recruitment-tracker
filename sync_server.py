import argparse
import json
import os
import subprocess
import threading
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
RECORDS_PATH = ROOT / "records.json"
MAX_BODY_BYTES = 2 * 1024 * 1024
RECORD_FIELDS = (
    "id",
    "company",
    "role",
    "type",
    "status",
    "date",
    "progress",
    "location",
    "website",
    "notes",
)
REQUIRED_FIELDS = set(RECORD_FIELDS)
ALLOWED_STATUSES = {"待投递", "已投递", "笔试中", "面试中", "综合评估中", "Offer", "已结束"}
GIT_LOCK = threading.Lock()


def run_git(*args):
    environment = os.environ.copy()
    environment["GIT_TERMINAL_PROMPT"] = "0"
    environment["GCM_INTERACTIVE"] = "Never"
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=environment,
        timeout=180,
    )


def validate_records(payload):
    if not isinstance(payload, list):
        raise ValueError("记录数据必须是数组")

    seen_ids = set()
    validated = []
    for index, record in enumerate(payload, start=1):
        if not isinstance(record, dict):
            raise ValueError(f"第 {index} 条记录格式错误")
        missing = REQUIRED_FIELDS - record.keys()
        if missing:
            raise ValueError(f"第 {index} 条记录缺少字段：{', '.join(sorted(missing))}")

        normalized = {}
        for field in RECORD_FIELDS:
            value = record[field]
            if not isinstance(value, str):
                raise ValueError(f"第 {index} 条记录的 {field} 必须是文本")
            normalized[field] = value.strip()

        if not normalized["id"] or normalized["id"] in seen_ids:
            raise ValueError(f"第 {index} 条记录 ID 为空或重复")
        if not normalized["company"] or not normalized["role"]:
            raise ValueError(f"第 {index} 条记录缺少公司或岗位")
        if normalized["status"] not in ALLOWED_STATUSES:
            raise ValueError(f"第 {index} 条记录状态无效")

        seen_ids.add(normalized["id"])
        validated.append(normalized)
    return validated


def write_records(records):
    temporary_path = RECORDS_PATH.with_suffix(".json.tmp")
    temporary_path.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_path.replace(RECORDS_PATH)


def commit_and_push():
    add_result = run_git("add", "--", RECORDS_PATH.name)
    if add_result.returncode != 0:
        raise RuntimeError(add_result.stderr.strip() or "git add 失败")

    diff_result = run_git("diff", "--cached", "--quiet", "--", RECORDS_PATH.name)
    if diff_result.returncode == 0:
        return {"changed": False, "pushed": True, "commit": ""}
    if diff_result.returncode != 1:
        raise RuntimeError(diff_result.stderr.strip() or "无法检查 Git 变更")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_result = run_git("commit", "-m", f"Update recruitment records {timestamp}")
    if commit_result.returncode != 0:
        raise RuntimeError(commit_result.stderr.strip() or "git commit 失败")

    push_result = run_git("push", "origin", "main")
    if push_result.returncode != 0:
        raise RuntimeError(push_result.stderr.strip() or "git push 失败")

    commit_hash = run_git("rev-parse", "--short", "HEAD")
    return {
        "changed": True,
        "pushed": True,
        "commit": commit_hash.stdout.strip(),
    }


class TrackerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        if self.path.startswith("/records.json") or self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if urlparse(self.path).path == "/api/status":
            self.send_json(HTTPStatus.OK, {"localAdmin": True, "autoPush": True})
            return
        super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != "/api/records":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "接口不存在"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > MAX_BODY_BYTES:
                raise ValueError("请求数据为空或过大")
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            records = validate_records(payload)
            with GIT_LOCK:
                write_records(records)
                git_result = commit_and_push()
            self.send_json(HTTPStatus.OK, {"saved": True, **git_result})
        except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"saved": False, "error": str(error)})
        except Exception as error:
            self.send_json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {"saved": RECORDS_PATH.exists(), "pushed": False, "error": str(error)},
            )

    def log_message(self, format_string, *args):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {format_string % args}")


def main():
    parser = argparse.ArgumentParser(description="秋招追踪器本地自动同步服务")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    server = ThreadingHTTPServer(("127.0.0.1", args.port), TrackerHandler)
    print(f"本地管理页面：http://127.0.0.1:{args.port}")
    print("保存或删除记录后，将自动提交并推送到 GitHub。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
