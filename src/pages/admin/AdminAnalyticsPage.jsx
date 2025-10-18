import React from 'react';
import { motion } from 'framer-motion';
import BreadcrumbItensAdmin from '../../components/BreadcrumbItensAdmin';
import GA4SimpleAnalytics from '../../components/admin/analytics/GA4SimpleAnalytics';

export default function AdminAnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <BreadcrumbItensAdmin
        items={[
          { label: "Admin", to: "/admin" },
          { label: "Analytics" }
        ]}
      />

      <div>
        <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-gray-600">
          Dados de tráfego e vendas via Google Analytics 4
        </p>
      </div>

      <GA4SimpleAnalytics />
    </motion.div>
  );
}
