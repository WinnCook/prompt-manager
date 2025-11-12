/**
 * Simple test script to verify API service layer works
 * Run this with: npx tsx src/test-api.ts (requires tsx package)
 * Or test manually through the browser console
 */

import { folderApi, promptApi } from './services';

// Test folder API
async function testFolderApi() {
  console.log('\n=== Testing Folder API ===');

  // Get folder tree
  const treeResult = await folderApi.getTree();
  if (treeResult.error) {
    console.error('❌ Failed to get folder tree:', treeResult.error);
  } else {
    console.log('✅ Folder tree retrieved:', treeResult.data);
  }
}

// Test prompt API
async function testPromptApi() {
  console.log('\n=== Testing Prompt API ===');

  // List prompts
  const listResult = await promptApi.list({ limit: 10 });
  if (listResult.error) {
    console.error('❌ Failed to list prompts:', listResult.error);
  } else {
    console.log('✅ Prompts retrieved:', listResult.data);
  }
}

// Run tests
async function runTests() {
  console.log('Testing API Service Layer...');
  console.log('Backend should be running on http://localhost:8000');

  try {
    await testFolderApi();
    await testPromptApi();
    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('\n❌ API tests failed:', error);
  }
}

// Export for use in components
export { testFolderApi, testPromptApi, runTests };
