// client/components/Testimonials.tsx

import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    { name: "María G.", comment: "¡Los mejores tequeños de Charallave! Llegaron súper calientes.", stars: 5 },
    { name: "Carlos P.", comment: "La Doble Shack es otro nivel. La carne smashed está brutal.", stars: 5 },
    { name: "Andrea L.", comment: "Delivery rápido y el packaging impecable. 100% recomendados.", stars: 5 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
         <h2 className="text-3xl font-heading font-bold text-slate-900 mb-12">
           Charallave habla de nosotros 🗣️
         </h2>
         <div className="grid md:grid-cols-3 gap-8">
           {reviews.map((rev, i) => (
             <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                  {[...Array(rev.stars)].map((_, i) => <Star key={i} fill="currentColor" size={20}/>)}
                </div>
                <p className="text-slate-600 italic mb-6">&quot;{rev.comment}&quot;</p>
                <div className="font-bold text-slate-900">{rev.name}</div>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
}