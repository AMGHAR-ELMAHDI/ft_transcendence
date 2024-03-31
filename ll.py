import time
import shutil
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class DesktopChangeHandler(FileSystemEventHandler):
    def __init__(self, source_dir, destination_dir):
        super().__init__()
        self.source_dir = source_dir
        self.destination_dir = destination_dir

    def on_any_event(self, event):
        if event.is_directory:
            return
        elif event.src_path.startswith(self.source_dir):
            print(f"Change detected: {event.event_type} - {event.src_path}")
            self.create_snapshot()

    def create_snapshot(self):
        timestamp = time.strftime("%Y-%m-%d_%H-%M-%S")
        snapshot_dir = os.path.join(self.destination_dir, f"snapshot_{timestamp}")
        shutil.copytree(self.source_dir, snapshot_dir)
        print(f"Snapshot created: {snapshot_dir}")

def monitor_desktop(source_dir, destination_dir):
    event_handler = DesktopChangeHandler(source_dir, destination_dir)
    observer = Observer()
    observer.schedule(event_handler, source_dir, recursive=True)
    observer.start()
    try:
        print(f"Monitoring {source_dir} for changes...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    desktop_dir = os.path.expanduser("~/Desktop")
    snapshot_dir = os.path.expanduser("~/DesktopSnapshots")
    if not os.path.exists(snapshot_dir):
        os.makedirs(snapshot_dir)
    monitor_desktop(desktop_dir, snapshot_dir)
