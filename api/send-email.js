import { handleResend } from "./_lib/resendReceipt.js";

export default function handler(req, res) {
  return handleResend(req, res, "email");
}
