import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/ai/ai-service';
import { handleAPIError, validateRequiredFields, validateFieldType, validateNumberRange } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    validateRequiredFields(body, ['location', 'eventType', 'guestCount', 'budget', 'date']);
    
    // Validate field types
    validateFieldType(body.location, 'string', 'location');
    validateFieldType(body.eventType, 'string', 'eventType');
    validateFieldType(body.guestCount, 'number', 'guestCount');
    validateFieldType(body.budget, 'number', 'budget');
    validateFieldType(body.date, 'string', 'date');
    
    // Validate ranges
    validateNumberRange(body.budget, 1, 1000000, 'budget');
    validateNumberRange(body.guestCount, 1, 10000, 'guestCount');
    
    const { location, eventType, guestCount, budget, date, preferences, style } = body;

    // Get smart venue recommendations using AI
    const recommendations = await aiService.getSmartVenueRecommendations({
      location,
      eventType,
      guestCount: Number(guestCount),
      budget: Number(budget),
      date,
      preferences,
      style,
    });

    return NextResponse.json({
      data: recommendations,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
