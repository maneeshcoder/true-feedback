import UserModel, { User } from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/otpion';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  request: any,
  { params }: any
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    if (!session || !_user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
     const messageId = params.messageId;
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { message: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}