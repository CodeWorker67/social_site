import { motion } from 'framer-motion';
import { Video, MessageSquare, Gamepad2, Wifi } from 'lucide-react';

const useCases = [
  { icon: Video, title: 'Видео и стримы', desc: 'Смотри и слушай на полной скорости, без обрывов' },
  { icon: MessageSquare, title: 'Чаты и звонки', desc: 'Голосовые и видеочаты без лагов и отключений' },
  { icon: Gamepad2, title: 'Игры', desc: 'Низкий пинг на европейских серверах. Стабильное соединение' },
  { icon: Wifi, title: 'Стабильный интернет', desc: 'Быстрое и надёжное соединение каждый день' },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-zoomer-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Всё работает <span className="text-gradient">быстро</span>
          </h2>
          <p className="text-gray-400">
            Видео, чаты, игры — стабильно и без тормозов.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:border-zoomer-neon/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-zoomer-neon/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-zoomer-neon/20 group-hover:scale-110 transition-all">
                <uc.icon className="w-7 h-7 text-zoomer-neon" />
              </div>
              <h3 className="text-white font-semibold mb-2">{uc.title}</h3>
              <p className="text-gray-400 text-sm">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
