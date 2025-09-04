import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { serverUrl, apiKey, clientId } = await request.json();

    if (!serverUrl || !apiKey || !clientId) {
      return NextResponse.json(
        { error: 'Missing required parameters: serverUrl, apiKey, clientId' },
        { status: 400 }
      );
    }

    // Test basic connectivity by fetching the Swagger spec
    // Handle different swagger endpoint formats
    let swaggerUrl = `${serverUrl}/swagger/v1/swagger.json`;
    
    // Try the swagger endpoint first
    let response;
    let swagger;
    
    try {
      response = await fetch(swaggerUrl, {
        headers: {
          'x-api-key': apiKey,
          'x-client-id': clientId,
          'Accept': 'application/json',
          'User-Agent': 'ErrorClub-Setup/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Swagger endpoint failed: HTTP ${response.status}`);
      }

      const responseText = await response.text();
      try {
        swagger = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON from swagger endpoint: ${parseError instanceof Error ? parseError.message : 'Parse failed'}`);
      }
    } catch (swaggerError) {
      // If swagger fails, try the user/myself endpoint as fallback
      console.log('Swagger endpoint failed, trying user/myself endpoint...');
      
      try {
        const userUrl = `${serverUrl}/api/user/myself`;
        response = await fetch(userUrl, {
          headers: {
            'x-api-key': apiKey,
            'x-client-id': clientId,
            'Accept': 'application/json',
            'User-Agent': 'ErrorClub-Setup/1.0',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`User endpoint also failed: HTTP ${response.status}. Original swagger error: ${swaggerError instanceof Error ? swaggerError.message : 'Unknown error'}`);
        }

        const userResponseText = await response.text();
        let userResponse;
        try {
          userResponse = JSON.parse(userResponseText);
        } catch (parseError) {
          throw new Error(`Invalid JSON from user endpoint: ${parseError instanceof Error ? parseError.message : 'Parse failed'}`);
        }

        // User endpoint worked, return success with user info
        return NextResponse.json({
          success: true,
          message: 'Successfully connected to API via user endpoint',
          data: {
            version: 'unknown',
            title: 'Consolidated API',
            paths: 'unknown',
            userEndpoint: true,
            userInfo: userResponse
          }
        });

      } catch (userError) {
        throw new Error(`Both swagger and user endpoints failed. Swagger: ${swaggerError instanceof Error ? swaggerError.message : 'Unknown error'}, User: ${userError instanceof Error ? userError.message : 'Unknown error'}`);
      }
    }
    
    // Basic validation of the swagger response
    if (!swagger.openapi && !swagger.swagger) {
      throw new Error('Invalid Swagger/OpenAPI specification received');
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to API',
      data: {
        version: swagger.info?.version || 'unknown',
        title: swagger.info?.title || 'API',
        paths: Object.keys(swagger.paths || {}).length,
      }
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    
    let errorMessage = 'Connection failed';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Connection timeout - API server may be unreachable';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'DNS resolution failed - check the server URL';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused - API server may be down';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed - check your API key and client ID';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access forbidden - check your API permissions';
      } else if (error.message.includes('404')) {
        errorMessage = 'Swagger endpoint not found - check the server URL';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
