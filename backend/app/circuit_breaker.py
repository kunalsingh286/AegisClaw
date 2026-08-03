import os
import asyncio
from typing import Callable, Any

FAILURE_MODE = os.environ.get("FAILURE_MODE", "FAIL_CLOSED").upper()

class CircuitBreakerError(Exception):
    pass

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, recovery_timeout: int = 10):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.is_open = False
        self.last_failure_time = 0

    async def call(self, func: Callable, *args, **kwargs) -> Any:
        if self.is_open:
            if asyncio.get_event_loop().time() - self.last_failure_time > self.recovery_timeout:
                self.is_open = False
                self.failure_count = 0
                print("Circuit Breaker: HALF-OPEN (Testing recovery)")
            else:
                return self._handle_fallback(func.__name__)

        try:
            result = await func(*args, **kwargs)
            self.failure_count = 0
            self.is_open = False
            return result
        except Exception as e:
            self.failure_count += 1
            print(f"Circuit Breaker: Error in {func.__name__} - {e}")
            if self.failure_count >= self.failure_threshold:
                self.is_open = True
                self.last_failure_time = asyncio.get_event_loop().time()
                print(f"CRITICAL ALERT: Circuit Breaker OPEN for {func.__name__}")
            return self._handle_fallback(func.__name__)

    def _handle_fallback(self, func_name: str) -> Any:
        print(f"Circuit Breaker Fallback triggered for {func_name}. Mode: {FAILURE_MODE}")
        if FAILURE_MODE == "FAIL_OPEN":
            # In fail-open, we allow traffic/checks to pass
            if "evaluate_policy" in func_name:
                return True
            if "is_killswitch_active" in func_name:
                return False
            if "check_and_record_spend" in func_name:
                return None
            return True
        else:
            # In fail-closed, we block traffic
            if "evaluate_policy" in func_name:
                return False
            if "is_killswitch_active" in func_name:
                return True
            if "check_and_record_spend" in func_name:
                from fastapi import HTTPException
                raise HTTPException(status_code=503, detail="Service Unavailable: Circuit Breaker Open")
            return False

# Global circuit breakers
cedar_cb = CircuitBreaker()
redis_cb = CircuitBreaker()
