'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Minus, Plus, Share2, MessageSquare, ShoppingBag } from 'lucide-react';
import { foodItems } from '@/data/vendors';
import { useCartStore } from '@/store/cart-store';

const mockReviews = [
  { id: 1, name: 'Rahul S.', avatar: '🎓', rating: 5, comment: 'Absolutely delicious! Authentic taste and generous portion size.', date: '2 days ago' },
  { id: 2, name: 'Priya M.', avatar: '🎓', rating: 4, comment: 'Great pre-order experience, food was hot at pickup time.', date: '1 week ago' },
  { id: 3, name: 'Amit K.', avatar: '🎓', rating: 5, comment: 'Best item on campus! Highly recommended.', date: '2 weeks ago' },
];

export default function FoodDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const foodId = params.id as string;
  
  const food = foodItems.find(item => item.id === foodId);
  
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const incrementQuantity = useCartStore(state => state.incrementQuantity);
  const decrementQuantity = useCartStore(state => state.decrementQuantity);

  if (!food) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-primary)', minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Food item not found</h2>
        <button onClick={() => router.back()} style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '600', boxShadow: 'var(--shadow-colored)' }}>Go Back</button>
      </div>
    );
  }

  const qty = cartItems.find(item => item.foodItem.id === food.id)?.quantity || 0;

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '160px', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Header / Image Area */}
      <div style={{ position: 'relative', height: '300px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {food.image.startsWith('http') || food.image.startsWith('/') ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '100px' }}>{food.image}</span>
        )}

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 60%, rgba(255,255,255,0.4) 100%)' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 10 }}>
          <button 
            onClick={() => router.back()}
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-medium)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
          >
            <ArrowLeft size={20} color="var(--text-primary)" />
          </button>
          <button 
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-medium)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
          >
            <Share2 size={20} color="var(--text-primary)" />
          </button>
        </div>
      </div>

      {/* Main Content Details */}
      <div style={{ padding: '0 20px', marginTop: '-30px', position: 'relative', zIndex: 5 }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  border: `1.5px solid ${food.isVeg ? '#16A34A' : '#DC2626'}`,
                  position: 'relative'
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: food.isVeg ? '#16A34A' : '#DC2626'
                }} />
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{food.category}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(252, 128, 25, 0.12)', padding: '4px 8px', borderRadius: '8px' }}>
              <Star size={14} fill="var(--primary)" color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>{food.rating} ({food.reviewCount})</span>
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{food.name}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>{food.description}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Price per portion</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>₹{food.price}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '13px', border: '1px solid var(--border-light)' }}>
              <Clock size={16} color="var(--primary)" />
              <span>Prep Time: <strong style={{ color: 'var(--text-primary)' }}>{food.prepTime} mins</strong></span>
            </div>
          </div>
        </div>

        {/* Ingredients & Nutrition */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Key Ingredients</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {food.ingredients.map(ing => (
              <span key={ing} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                {ing}
              </span>
            ))}
          </div>

          {food.nutrition && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Nutrition Info</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Calories</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{food.nutrition.calories}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Protein</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{food.nutrition.protein}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Carbs</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{food.nutrition.carbs}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Fat</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{food.nutrition.fat}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Reviews */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary)" /> Student Reviews
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockReviews.map(r => (
              <div key={r.id} style={{ backgroundColor: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{r.name}</span>
                  <span style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 700 }}>★ {r.rating}.0</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add to Cart Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: '85px',
        left: 0,
        right: 0,
        padding: '14px 20px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {qty > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-elevated)', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--primary)' }}>
            <button onClick={() => decrementQuantity(food.id)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
              <Minus size={18} />
            </button>
            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '18px' }}>{qty}</span>
            <button onClick={() => incrementQuantity(food.id)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(food)}
            style={{
              flex: 1,
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-colored)'
            }}
          >
            <ShoppingBag size={18} /> Add to Cart (₹{food.price})
          </button>
        )}

        {qty > 0 && (
          <button
            onClick={() => router.push('/cart')}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-colored)'
            }}
          >
            Go to Cart →
          </button>
        )}
      </div>
    </div>
  );
}
