import React from 'react';
import { DashboardStats } from '@/pages/dashboard/components/DashboardStats';
import { RecentItems } from '@/pages/dashboard/components/RecentItems';
import { ItemMap } from '@/pages/dashboard/components/ItemMap';
import { ItemList } from '@/components/dashboard/ItemList';
import { ItemCard } from '@/components/shared/ItemCard';
import { Item } from '@/services/api';

// Mock data for testing
const mockStats = [
  { label: 'Total Lost Items', value: 15 },
  { label: 'Total Found Items', value: 12 },
  { label: 'Items Reunited', value: 8 },
  { label: 'Success Rate', value: 73 }
];

const mockItems: Item[] = [
  {
    id: '1',
    name: 'iPhone 13',
    description: 'Blue iPhone 13 with a cracked screen protector',
    category: 'Electronics',
    location: 'Library - 2nd Floor',
    date: '2024-01-10',
    type: 'lost',
    status: 'Active',
    user_id: 'user1',
    created_at: '2024-01-10T10:00:00Z',
    image_url: undefined,
    reward: 50
  },
  {
    id: '2',
    name: 'Red Backpack',
    description: 'Nike red backpack with laptop compartment',
    category: 'Bags',
    location: 'Student Center',
    date: '2024-01-09',
    type: 'found',
    status: 'Waiting for owner',
    user_id: 'user2',
    created_at: '2024-01-09T14:30:00Z',
    image_url: undefined
  },
  {
    id: '3',
    name: 'Gold Ring',
    description: 'Small gold ring with a small diamond',
    category: 'Jewelry',
    location: 'Gym - Locker Room',
    date: '2024-01-08',
    type: 'lost',
    status: 'Active',
    user_id: 'user3',
    created_at: '2024-01-08T16:45:00Z',
    image_url: undefined,
    reward: 100
  }
];

export function DashboardDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Components Demo</h1>
        
        {/* Stats Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard Stats</h2>
          <DashboardStats stats={mockStats} />
        </section>

        {/* Recent Items Section */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Lost Items</h2>
            <RecentItems type="lost" items={mockItems.filter(item => item.type === 'lost')} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Found Items</h2>
            <RecentItems type="found" items={mockItems.filter(item => item.type === 'found')} />
          </div>
        </section>

        {/* Item Map Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Items Map</h2>
          <ItemMap 
            lostItems={mockItems.filter(item => item.type === 'lost')} 
            foundItems={mockItems.filter(item => item.type === 'found')} 
          />
        </section>

        {/* Item List Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Item List</h2>
          <ItemList items={mockItems} type="all" onItemClick={(item) => console.log('Clicked item:', item)} />
        </section>

        {/* Individual Item Cards */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Item Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockItems.map(item => (
              <ItemCard key={item.id} item={item} onClick={() => console.log('Clicked card:', item)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}