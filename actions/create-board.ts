'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
}

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters',
  }),
})

export async function create(previousState: State, formData: FormData) {
  const validateFields = CreateBoard.safeParse({
    title: formData.get('title'),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing fields',
    }
  }

  const { title } = validateFields.data

  try {
    await db.board.create({
      data: {
        title,
      },
    })
  } catch (error) {
    return {
      message: 'Database error',
    }
  }

  revalidatePath('/organization/:organizationId')
  redirect('/organization/:organizationId')
}
