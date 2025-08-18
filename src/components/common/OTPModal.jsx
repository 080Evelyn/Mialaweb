import React, { useEffect, useMemo, useRef, useState } from "react";

export default function OTPModal({
  isOpen,
  onClose,
  onVerify,
  loading,
  errorMsg,
  length = 6,
  title = "Enter verification code",
  subtitle = "We sent a 6-digit code to your email.",
}) {
  const [digits, setDigits] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(Array(length).fill(""));
      // focus first input when opened
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
  }, [isOpen, length]);

  const code = useMemo(() => digits.join(""), [digits]);
  const isComplete = code.length === length;

  const close = () => {
    setDigits(Array(length).fill(""));
    onClose?.();
  };

  const handleChange = (i, val) => {
    // keep only the first numeric char
    const char = (val.match(/\d/) || [""])[0];
    setDigits((prev) => {
      const next = [...prev];
      next[i] = char;
      return next;
    });

    // move to next box if a digit was entered
    if (char && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        // clear current first
        setDigits((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });
      } else if (i > 0) {
        // jump back if already empty
        inputsRef.current[i - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[i - 1] = "";
          return next;
        });
      }
    }
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1)
      inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (i, e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    setDigits((prev) => {
      const next = [...prev];
      for (let j = 0; j < length - i; j++)
        next[i + j] = pasted[j] ?? next[i + j];
      return next.slice(0, length);
    });
    const lastIndex = Math.min(i + pasted.length - 1, length - 1);
    inputsRef.current[lastIndex]?.focus();
  };
  const submit = () => {
    if (!isComplete) return;
    onVerify?.(code);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            ✕
          </button>
        </div>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}>
          <div className="flex justify-between gap-2">
            {Array.from({ length }).map((_, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digits[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl tracking-widest focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>
          {errorMsg && (
            <p className="text-xs text-red-600 text-center pt-3">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={!isComplete}
            className={`mt-6 w-full rounded-xl bg-[#B10303] px-4 py-3 font-medium text-white  ${
              !isComplete
                ? "disabled:opacity-50 disabled:cursor-not-allowed"
                : ""
            }`}>
            {loading ? "Verifying otp.." : "Verify"}
          </button>

          <button
            type="button"
            onClick={() => setDigits(Array(length).fill(""))}
            className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Clear
          </button>
        </form>

        {/* <p className="mt-4 text-center text-xs text-gray-500">
          Didn’t get the code?
          <button className="font-medium text-red-600">Resend</button>
        </p> */}
      </div>
    </div>
  );
}
