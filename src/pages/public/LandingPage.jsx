import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '20px'
          }}>
            S
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>SmartServe</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        flex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          Enterprise-Grade Complaint & Service Request Platform
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          marginBottom: '20px'
        }}>
          Centralized Reporting, Tracking & Rapid Service Resolution
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#475569',
          lineHeight: 1.6,
          marginBottom: '36px',
          maxWidth: '720px',
          margin: '0 auto 36px'
        }}>
          SmartServe streamlines issue submission, intelligent priority calculation, automated assignment, and transparent resolution tracking across your organization.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '16px' }}>
            Submit a Complaint <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '16px' }}>
            Admin Dashboard
          </Link>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          textAlign: 'left'
        }}>
          <div className="card">
            <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: '16px' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Real-Time Status Tracking</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Follow your complaint from initial submission through assignment to complete resolution with transparent timeline updates.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', background: '#EDE9FE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Intelligent Prioritization</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Automated priority detection and resolution time estimates based on category severity and historical resolution data.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '44px', height: '44px', background: '#D1FAE5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '16px' }}>
              <BarChart2 size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Analytical Dashboards</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Comprehensive administrative analytics detailing department performance, resolution bottlenecks, and category distributions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '24px 40px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '14px'
      }}>
        SmartServe Complaint & Service Request Management System © 2026. Production Quality Application.
      </footer>
    </div>
  );
};

export default LandingPage;
