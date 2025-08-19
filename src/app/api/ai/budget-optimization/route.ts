import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/ai/enhanced-ai-service';
import { handleAPIError, validateRequiredFields, validateFieldType, validateNumberRange } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    validateRequiredFields(body, ['budget', 'eventType', 'guestCount', 'location']);
    
    // Validate field types
    validateFieldType(body.budget, 'number', 'budget');
    validateFieldType(body.eventType, 'string', 'eventType');
    validateFieldType(body.guestCount, 'number', 'guestCount');
    validateFieldType(body.location, 'string', 'location');
    
    // Validate ranges
    validateNumberRange(body.budget, 1, 1000000, 'budget');
    validateNumberRange(body.guestCount, 1, 10000, 'guestCount');
    
    const { budget, eventType, guestCount, location } = body;

    // Get AI-powered budget optimization
    const optimization = await aiService.getAIBudgetOptimization(
      Number(budget),
      eventType,
      Number(guestCount),
      location
    );

    return NextResponse.json({
      data: optimization,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
