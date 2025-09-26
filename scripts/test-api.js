#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🧪 Testing API Endpoints...\n');

// Test transcript API
async function testTranscriptAPI() {
  console.log('📝 Testing Transcript API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/get-transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId: 'dQw4w9WgXcQ' // Rick Roll video ID for testing
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Transcript API working');
      console.log(`   Found ${data.transcript.length} transcript items`);
      return data.transcript;
    } else {
      console.log('❌ Transcript API failed:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Transcript API error:', error.message);
    return null;
  }
}

// Test content generation API
async function testContentGenerationAPI(transcript) {
  console.log('\n🤖 Testing Content Generation API...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('   Please run: npm run setup');
    return false;
  }
  
  if (!transcript) {
    console.log('❌ No transcript available for testing');
    return false;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId: 'dQw4w9WgXcQ',
        videoTitle: 'Test Video',
        transcript: transcript.slice(0, 5), // Use first 5 items for testing
        contentType: 'quiz'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Content Generation API working');
      console.log(`   Generated ${data.content.questions?.length || 0} quiz questions`);
      return true;
    } else {
      console.log('❌ Content Generation API failed:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Content Generation API error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  // Check if server is running
  try {
    const response = await fetch('http://localhost:3000');
    if (!response.ok) {
      throw new Error('Server not responding');
    }
  } catch (error) {
    console.log('❌ Development server is not running');
    console.log('   Please start the server with: npm run dev');
    process.exit(1);
  }
  
  const transcript = await testTranscriptAPI();
  const contentGenWorking = await testContentGenerationAPI(transcript);
  
  console.log('\n📊 Test Results:');
  console.log(`   Transcript API: ${transcript ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Content Generation API: ${contentGenWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (transcript && contentGenWorking) {
    console.log('\n🎉 All tests passed! Your setup is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the setup guide.');
  }
}

// Run tests
runTests().catch(console.error);
