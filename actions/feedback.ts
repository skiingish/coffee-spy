'use server';

import { db } from '@/lib/db';
import { feedback } from '@/db/schema/feedback';

interface SubmitFeedbackParams {
  message: string;
  name?: string;
  contact?: string;
}

export async function submitFeedback({ message, name, contact }: SubmitFeedbackParams) {
  try {
    await db.insert(feedback).values({
      message,
      name: name || null,
      contact: contact || null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback');
  }
}
