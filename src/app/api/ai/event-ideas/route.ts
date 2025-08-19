import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/ai/ai-service';
import { handleAPIError, validateRequiredFields, validateFieldType, validateNumberRange } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    validateRequiredFields(body, ['eventType', 'budget', 'guestCount']);
    
    // Validate field types
    validateFieldType(body.eventType, 'string', 'eventType');
    validateFieldType(body.budget, 'number', 'budget');
    validateFieldType(body.guestCount, 'number', 'guestCount');
    
    // Validate ranges
    validateNumberRange(body.budget, 1, 1000000, 'budget');
    validateNumberRange(body.guestCount, 1, 10000, 'guestCount');
    
    const { eventType, budget, guestCount, additionalInfo } = body;

    // Generate event ideas using AI
    const eventIdeas = await aiService.generateEventIdeas({
      eventType,
      budget: Number(budget),
      guestCount: Number(guestCount),
      additionalInfo,
    });

    return NextResponse.json({
      data: eventIdeas,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
