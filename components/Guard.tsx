'use client';

import React from 'react';

interface GuardProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Guard({ role, children, fallback = null }: GuardProps) {
  // This would typically check user roles from JWT claims
  // For now, we'll implement a basic version
  const hasRole = (requiredRole: string | string[]) => {
    // Mock implementation - in real app, would check JWT claims
    const userRoles = ['Contributor']; // Would come from JWT
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(requiredRole);
  };

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
