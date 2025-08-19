import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Try to connect to local Ollama instance
    let response;
    try {
      response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral', // Default model
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000
          }
        })
      });
    } catch (error) {
      // If Ollama is not running, return fallback response
      return NextResponse.json({
        response: generateFallbackResponse(prompt),
        source: 'fallback'
      });
    }

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.response || '',
      source: 'ollama'
    });
  } catch (error) {
    console.error('Local AI error:', error);
    
    // Return fallback response on any error
    return NextResponse.json({
      response: generateFallbackResponse(''),
      source: 'fallback',
      error: error.message
    });
  }
}

function generateFallbackResponse(prompt: string): string {
  // Generate intelligent fallback responses based on prompt content
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('event') || lowerPrompt.includes('party')) {
    return JSON.stringify({
      ideas: [
        {
          name: "Classic Celebration",
          description: "A timeless event with elegant decor and professional service",
          estimatedCost: 5000,
          keyFeatures: ["Professional catering", "Live entertainment", "Elegant decorations"],
          tips: ["Book early", "Consider off-peak seasons", "Negotiate package deals"]
        }
      ]
    });
  }
  
  if (lowerPrompt.includes('venue') || lowerPrompt.includes('location')) {
    return JSON.stringify({
      recommendations: [
        {
          name: "Premium Event Space",
          description: "Versatile venue suitable for various event types",
          estimatedCost: 3000,
          features: ["Flexible capacity", "Professional staff", "Parking available"],
          availability: "Check calendar for specific dates"
        }
      ]
    });
  }
  
  if (lowerPrompt.includes('budget') || lowerPrompt.includes('cost')) {
    return JSON.stringify({
      breakdown: {
        venue: 40,
        catering: 30,
        entertainment: 15,
        decor: 10,
        miscellaneous: 5
      },
      tips: ["Book early for better rates", "Consider DIY options", "Negotiate with vendors"]
    });
  }
  
  // Default fallback
  return JSON.stringify({
    message: "AI service temporarily unavailable. Please try again later or contact support.",
    fallback: true
  });
}
