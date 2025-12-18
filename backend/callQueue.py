from time import time

class Call:
    def __init__(self, ready_time: float):
        self.ready_time = ready_time
    
    def isReady(self) -> bool:
        return time() >= self.ready_time

class CallQueue:
    def __init__(self, request_delay):
        self.delay = request_delay
        self.last_request = 0
        self.total_calls = 0

    def __repr__(self) -> str:
        return f'{self.total_calls} calls (last call: {self.last_request:.2f}) | {self.delay:.2f} second delay'

    def addCall(self) -> Call:
        if time() - self.last_request >= self.delay:
            ready_time = time()
        else:
            ready_time = self.last_request + self.delay
        self.last_request = ready_time
        self.total_calls += 1

        c = Call(ready_time)
        return c

    def reset(self) -> None:
        self.last_request = 0