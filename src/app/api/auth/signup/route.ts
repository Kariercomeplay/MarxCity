import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { ApiResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }
    await connectDB();
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email hoặc tên đăng nhập đã tồn tại' },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });
    return NextResponse.json<ApiResponse<{ id: string; username: string; email: string }>>(
      { success: true, data: { id: user._id.toString(), username: user.username, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
}
