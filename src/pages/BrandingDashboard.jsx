import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, AlertCircle, Activity, Brain, Heart, Zap,
  Users, TrendingUp, CheckCircle, ArrowRight
} from 'lucide-react';

const BrandingDashboard = () => {
  return (
    <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sparkles className="w-12 h-12 text-forest-light" />
            <h1 className="text-6xl md:text-7xl font-bold text-forest-light">
              ZYNTRA
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-forest-light/90 font-light">
            Your Workplace Wellness & Attendance Buddy
          </p>
          <p className="text-lg text-forest-light/70 max-w-3xl mx-auto">
            Making workplace wellness visible, measurable, and empathetic through AI-powered insights
          </p>
        </motion.div>

        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-10 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-forest-light" />
            <h2 className="text-3xl md:text-4xl font-bold text-forest-light">The Problem</h2>
          </div>
          <p className="text-lg text-forest-light/80 mb-8 leading-relaxed">
            Employees silently struggle with fatigue, disengagement, and burnout. 
            Traditional HR systems track attendance but miss the most critical factor: well-being.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Poor posture leading to chronic pain",
              "Working in isolation without connection",
              "No early detection of fatigue signs",
              "Burnout goes unnoticed until critical"
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-forest-light mt-2 flex-shrink-0"></div>
                <p className="text-forest-light/90">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 md:p-10 rounded-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest-light mb-8 text-center">
            Our Solution
          </h2>
          <p className="text-lg text-forest-light/80 mb-10 text-center max-w-3xl mx-auto">
            ZYNTRA bridges technology with empathy, providing real-time insights that help 
            employees thrive and teams stay connected.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Posture & Focus",
                desc: "Real-time monitoring throughout the workday"
              },
              {
                icon: Brain,
                title: "AI Insights",
                desc: "Personalized wellness recommendations"
              },
              {
                icon: Heart,
                title: "Wellness Analytics",
                desc: "Comprehensive engagement & fatigue metrics"
              },
              {
                icon: Zap,
                title: "Quick Actions",
                desc: "One-click wellness interventions"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <feature.icon className="w-10 h-10 text-forest-light mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-forest-light mb-2">{feature.title}</h3>
                <p className="text-sm text-forest-light/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-8 md:p-10 rounded-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest-light mb-10 text-center">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            {[
              { num: "01", title: "Data Collection", desc: "Monitor posture, focus, and engagement" },
              { num: "02", title: "AI Processing", desc: "Analyze patterns and detect issues" },
              { num: "03", title: "Insights", desc: "Receive personalized recommendations" }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-forest-light/20 to-forest-light/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <span className="text-3xl font-bold text-forest-light">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-forest-light mb-2">{step.title}</h3>
                  <p className="text-forest-light/70">{step.desc}</p>
                </div>
                {idx < 2 && (
                  <ArrowRight className="hidden md:block w-8 h-8 text-forest-light/30" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card p-8 md:p-10 rounded-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest-light mb-10 text-center">
            Who Benefits?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Employees",
                benefits: [
                  "Feel supported and valued",
                  "Improve posture and wellness",
                  "Build healthy habits",
                  "Prevent burnout early"
                ]
              },
              {
                icon: TrendingUp,
                title: "HR Teams",
                benefits: [
                  "Detect issues proactively",
                  "Support employee well-being",
                  "Track wellness metrics",
                  "Make data-driven decisions"
                ]
              },
              {
                icon: CheckCircle,
                title: "Companies",
                benefits: [
                  "Increase productivity",
                  "Reduce absenteeism",
                  "Improve retention rates",
                  "Build positive culture"
                ]
              }
            ].map((group, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <group.icon className="w-10 h-10 text-forest-light mb-4" />
                <h3 className="text-xl font-semibold text-forest-light mb-4">{group.title}</h3>
                <ul className="space-y-3">
                  {group.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-forest-light/80">
                      <CheckCircle className="w-4 h-4 text-forest-light/60 mt-1 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="glass-card p-10 md:p-14 rounded-2xl text-center"
        >
          <Sparkles className="w-12 h-12 text-forest-light mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-forest-light mb-4">Our Mission</h2>
          <p className="text-xl md:text-2xl text-forest-light/90 italic max-w-3xl mx-auto leading-relaxed">
            "To make workplace wellness visible, measurable, and empathetic"
          </p>
          <p className="text-forest-light/60 mt-6">
            Transforming workplace culture, one wellness metric at a time 🌱
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default BrandingDashboard;
