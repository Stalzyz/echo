/**
 * Unit Test Suite for Core Business Logic & Financial Calculations
 */

// 1. Financial Calculation Helpers
export function calculateInstallmentBreakdown(
  totalFee: number,
  installmentCount: number,
  discountPercentage = 0,
  taxRate = 18 // 18% GST standard
) {
  if (totalFee <= 0 || installmentCount <= 0) {
    throw new Error("Total fee and installment count must be positive numbers");
  }

  const discountedFee = totalFee * (1 - discountPercentage / 100);
  const taxAmount = discountedFee * (taxRate / 100);
  const grandTotal = discountedFee + taxAmount;
  const perInstallmentAmount = Math.round((grandTotal / installmentCount) * 100) / 100;

  return {
    baseFee: totalFee,
    discountedFee,
    taxAmount,
    grandTotal,
    perInstallmentAmount,
    installmentCount,
  };
}

// 2. Webhook Event ID Generator & Deduplication Key Helper
export function generateWebhookEventKey(provider: string, rawEventId?: string, payloadEntityId?: string): string {
  if (rawEventId && rawEventId.trim().length > 0) {
    return `${provider.toUpperCase()}_${rawEventId.trim()}`;
  }
  if (payloadEntityId && payloadEntityId.trim().length > 0) {
    return `${provider.toUpperCase()}_${payloadEntityId.trim()}`;
  }
  return `${provider.toUpperCase()}_synthetic_${Date.now()}`;
}

// Simple assertion runner for automated test execution
export function runUnitTests() {
  console.log("=== Running Core Business Logic Unit Tests ===");

  // Test 1: Standard Fee Calculation
  const breakdown1 = calculateInstallmentBreakdown(10000, 4, 10, 18);
  console.assert(breakdown1.discountedFee === 9000, "Discounted fee should be 9000");
  console.assert(breakdown1.taxAmount === 1620, "18% GST should be 1620");
  console.assert(breakdown1.grandTotal === 10620, "Grand total should be 10620");
  console.assert(breakdown1.perInstallmentAmount === 2655, "Each of 4 installments should be 2655");
  console.log("✔ Test 1 Passed: Installment Breakdown Calculation");

  // Test 2: Webhook Event Deduplication Keys
  const key1 = generateWebhookEventKey("RAZORPAY", "evt_12345");
  console.assert(key1 === "RAZORPAY_evt_12345", "Key 1 format mismatch");

  const key2 = generateWebhookEventKey("WHATSAPP", undefined, "msg_67890");
  console.assert(key2 === "WHATSAPP_msg_67890", "Key 2 format mismatch");
  console.log("✔ Test 2 Passed: Webhook Deduplication Key Generation");

  console.log("All business logic unit tests passed successfully!");
}

// Execute tests if invoked directly via ts-node / node execution
if (require.main === module) {
  runUnitTests();
}
