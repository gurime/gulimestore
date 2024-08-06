// app/api/search/route.tsx
import { NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/app/Config/firebase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term') || '';

  if (!term.trim()) {
    return NextResponse.json({ error: 'Valid search term is required' }, { status: 400 });
  }

  try {
    // Fetch all data
    const allDataQuery = query(collection(db, 'products'), limit(10));
    const allDataSnapshot = await getDocs(allDataQuery);
    const allData = allDataSnapshot.docs.map(doc => doc.data());

    // Perform the search query
    const searchQuery = query(
      collection(db, 'products'),
      where('title', '>=', term),
      where('title', '<=', term + '\uf8ff'), // Using Unicode to limit the range
      orderBy('created_at', 'desc'),
      limit(10)
    );
    const searchSnapshot = await getDocs(searchQuery);
    const searchResults = searchSnapshot.docs.map(doc => doc.data());

    return NextResponse.json({
      results: searchResults,
      allData: allData,
      total: searchResults.length,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
