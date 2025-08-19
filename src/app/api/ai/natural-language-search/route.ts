import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/ai/enhanced-ai-service';
import { handleAPIError, validateRequiredFields, validateFieldType } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    validateRequiredFields(body, ['query']);
    
    // Validate field types
    validateFieldType(body.query, 'string', 'query');
    
    const { query } = body;

    // Process natural language query using AI
    const parsedQuery = await aiService.processNaturalLanguageQuery(query);

    return NextResponse.json({
      data: parsedQuery,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
