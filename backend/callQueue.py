from time import monotonic
from threading import Lock

class Call:
    def __init__(self, ready_time: float):
        self.ready_time = ready_time
    
    def isReady(self) -> bool:
        return monotonic() >= self.ready_time

class CallQueue:
    def __init__(self, request_delay):
        self.delay = request_delay
        self.last_request = 0.0
        self.total_calls = 0
        self._lock = Lock()

    def __repr__(self) -> str:
        return f'{self.total_calls} calls (last call: {self.last_request:.2f}) | {self.delay:.2f} second delay'

    def addCall(self) -> Call:
        with self._lock:
            now = monotonic()
            if now - self.last_request >= self.delay:
                ready_time = now
            else:
                ready_time = self.last_request + self.delay
            self.last_request = ready_time
            self.total_calls += 1

            c = Call(ready_time)
            return c

    def reset(self) -> None:
        with self._lock:
            self.last_request = 0
            self.total_calls = 0