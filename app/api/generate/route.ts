import ky from "ky";
import { NextResponse } from "next/server";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await ky(`${process.env.NEXT_PUBLIC_IDPHOTO_API_URL}`,
            {
                method: 'post',
                headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify(data),
                timeout: false
            }
        )
        const result = await response.json() as any;
        return NextResponse.json({ status: 200, data: result.data }, { status: 200 });
    } catch (error: any) {
        if (error.response) {
            try {
                const errorData = await error.response.json();
                return NextResponse.json({ ...errorData }, { status: 200 });
            } catch (parseError) {
                console.log('Error parsing JSON from response:', parseError);
                return NextResponse.json({ message: 'Failed to parse error response' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: error || 'Unknown error' }, { status: 400 });
        }
    }
}

