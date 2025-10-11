/**
 * SSE Configuration Test Script
 * Run this to verify SSE configuration
 */

const config = require('../config/sse.ts');

console.log('🔍 SSE Configuration Test');
console.log('========================');

// Test environment detection
const env = process.env.NODE_ENV || 'development';
console.log(`Environment: ${env}`);

// Test configuration
const sseConfig = config.getSSEConfig();
console.log('\n📋 Current Configuration:');
console.log(JSON.stringify(sseConfig, null, 2));

// Test mock mode
const mockEnabled = process.env.NEXT_PUBLIC_SSE_MOCK === 'true';
console.log(`\n🎭 Mock Mode: ${mockEnabled ? 'ENABLED' : 'DISABLED'}`);

// Test cart config
const cartConfig = config.getCartSSEConfig(123);
console.log('\n🛒 Cart SSE Configuration:');
console.log(JSON.stringify(cartConfig, null, 2));

console.log('\n✅ Configuration test complete!');
console.log('\n💡 Tips:');
console.log('- Set NEXT_PUBLIC_SSE_MOCK=true to enable mock mode');
console.log('- Set NODE_ENV=production for production settings');
console.log('- Check browser console for SSE connection logs');
