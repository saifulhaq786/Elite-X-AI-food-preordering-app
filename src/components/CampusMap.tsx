'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Compass, Star, Clock, X, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface CanteenLocation {
  id: string;
  name: string;
  tagline: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  isOpen: boolean;
  coverImage: string;
}

const CANTEEN_LOCATIONS: CanteenLocation[] = [
  {
    id: 'tasty-times',
    name: 'Tasty Times Canteen',
    tagline: 'Main Academic Block Ground Floor',
    lat: 28.7495,
    lng: 77.1170,
    address: 'DTU Main Campus, Academic Block A',
    rating: 4.8,
    isOpen: true,
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
  },
  {
    id: 'crunchy-king',
    name: 'Crunchy King Fast Food',
    tagline: 'Central Student Activity Center',
    lat: 28.7502,
    lng: 77.1182,
    address: 'Food Court Complex, SAC Building',
    rating: 4.6,
    isOpen: true,
    coverImage: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&q=80',
  },
  {
    id: 'royal-kitchen',
    name: 'Royal Kitchen Thali & Meals',
    tagline: 'Hostel Complex Zone 2',
    lat: 28.7482,
    lng: 77.1155,
    address: 'Opposite Boys Hostel 4',
    rating: 4.7,
    isOpen: true,
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
  },
  {
    id: 'coffee-day',
    name: 'Kulhad Chai & Coffee Lounge',
    tagline: 'Central Library Lawns',
    lat: 28.7510,
    lng: 77.1162,
    address: 'Near Central Library Lawn Gate 1',
    rating: 4.9,
    isOpen: true,
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&q=80',
  },
];

interface CampusMapProps {
  selectedVendorId?: string;
  onSelectVendor?: (vendorId: string) => void;
}

export default function CampusMap({ selectedVendorId, onSelectVendor }: CampusMapProps) {
  const [activeLocation, setActiveLocation] = useState<CanteenLocation | null>(() => {
    if (selectedVendorId) {
      return CANTEEN_LOCATIONS.find(c => c.id === selectedVendorId) || CANTEEN_LOCATIONS[0];
    }
    return CANTEEN_LOCATIONS[0];
  });

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Haversine Distance Formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoords(coords);
          setIsLocating(false);

          if (activeLocation) {
            const dist = calculateDistance(coords.lat, coords.lng, activeLocation.lat, activeLocation.lng);
            setDistanceKm(dist);
          }
        },
        (error) => {
          console.warn('Geolocation access denied or unavailable:', error);
          // Fallback user location in campus
          const fallbackUser = { lat: 28.7490, lng: 77.1165 };
          setUserCoords(fallbackUser);
          setIsLocating(false);
          if (activeLocation) {
            const dist = calculateDistance(fallbackUser.lat, fallbackUser.lng, activeLocation.lat, activeLocation.lng);
            setDistanceKm(dist);
          }
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (activeLocation && userCoords) {
      const dist = calculateDistance(userCoords.lat, userCoords.lng, activeLocation.lat, activeLocation.lng);
      setDistanceKm(dist);
    }
  }, [activeLocation, userCoords]);

  const googleMapEmbedUrl = activeLocation
    ? `https://maps.google.com/maps?q=${activeLocation.lat},${activeLocation.lng}&hl=es&z=17&output=embed`
    : `https://maps.google.com/maps?q=28.7495,77.1170&hl=es&z=16&output=embed`;

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {/* Map Header */}
      <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Live Campus Canteen GPS Map</h3>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Find nearest canteens & walk times</div>
          </div>
        </div>

        <button
          onClick={handleGetCurrentLocation}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-colored)'
          }}
        >
          <Navigation size={14} /> {isLocating ? 'Locating...' : 'Locate Me'}
        </button>
      </div>

      {/* Canteen Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto', borderBottom: '1px solid var(--border-light)' }}>
        {CANTEEN_LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setActiveLocation(loc);
              if (onSelectVendor) onSelectVendor(loc.id);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: activeLocation?.id === loc.id ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
              backgroundColor: activeLocation?.id === loc.id ? 'rgba(252, 128, 25, 0.1)' : 'var(--bg-surface)',
              color: activeLocation?.id === loc.id ? 'var(--primary)' : 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MapPin size={12} /> {loc.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Google Maps iFrame Container */}
      <div style={{ position: 'relative', height: '240px', width: '100%', backgroundColor: 'var(--bg-elevated)' }}>
        <iframe
          title="Google Map Campus View"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={googleMapEmbedUrl}
        />

        {/* Floating Distance Badge */}
        {distanceKm !== null && activeLocation && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--bg-surface)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid var(--primary)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 5
          }}>
            <Compass size={16} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)' }}>{distanceKm} km away</div>
              <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>~{Math.ceil(distanceKm * 12)} min walk</div>
            </div>
          </div>
        )}
      </div>

      {/* Active Canteen Details Popup Banner */}
      {activeLocation && (
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeLocation.coverImage} alt={activeLocation.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>{activeLocation.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activeLocation.address}</div>
              <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', marginTop: '2px' }}>
                ★ {activeLocation.rating} Rating • Open Now
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeLocation.lat},${activeLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Directions <ExternalLink size={12} />
            </a>

            <Link href={`/vendor/${activeLocation.id}`} style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-colored)'
              }}>
                Pre-Order <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
