import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function POST() {
  try {
    await connectToDatabase()

    // Clear any existing About model
    if (mongoose.models.About) {
      delete mongoose.models.About
      console.log('Cleared existing About model')
    }

    // Define fresh schema
    const TeamMemberSchema = new mongoose.Schema({
      name: { type: String, required: true },
      role: { type: String, required: true },
      experience: { type: String, required: true },
      specialization: { type: String, required: true },
      image: { type: String, default: '' },
      bio: { type: String, required: true },
    })

    const ExperienceSchema = new mongoose.Schema({
      years: { type: Number, required: true, default: 0 },
      events: { type: Number, required: true, default: 0 },
      clients: { type: Number, required: true, default: 0 },
    })

    const AboutSchema = new mongoose.Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        story: { type: String, required: true },
        mission: { type: String, required: true },
        vision: { type: String, required: true },
        values: [{ type: String, required: true }],
        experience: { type: ExperienceSchema, required: true },
        team: [TeamMemberSchema],
      },
      {
        timestamps: true,
      },
    )

    const FreshAbout = mongoose.model('About', AboutSchema)

    // Drop collection and recreate
    await FreshAbout.collection
      .drop()
      .catch(() => console.log('Collection does not exist'))

    // Create test data
    const testData = {
      title: 'TEST - Legato Sounds and Lights',
      description: 'TEST - This is a test description',
      story: 'TEST - This is a test story',
      mission: 'TEST - This is a test mission',
      vision: 'TEST - This is a test vision',
      values: ['Test Value 1', 'Test Value 2'],
      experience: {
        years: 10,
        events: 999,
        clients: 888,
      },
      team: [
        {
          name: 'Test Person',
          role: 'Test Role',
          experience: 'Test Experience',
          specialization: 'Test Spec',
          image: '/test.jpg',
          bio: 'Test bio',
        },
      ],
    }

    console.log(
      'Creating test About with data:',
      JSON.stringify(testData, null, 2),
    )

    const result = await FreshAbout.create(testData)

    console.log('Created result:', JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Test About created successfully',
    })
  } catch (error) {
    console.error('Error in test route:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 },
    )
  }
}
