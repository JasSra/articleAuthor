'use client';

import React, { memo, useMemo } from 'react';

interface GuardProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const Guard = memo(function Guard({ role, children, fallback = null }: GuardProps) {
  // This would typically check user roles from JWT claims
  // For now, we'll implement a basic version
  const userRoles = useMemo(() => ['Contributor'], []); // Would come from JWT

  const hasRole = (requiredRole: string | string[]) => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(r => userRoles.includes(r));
    }
    return userRoles.includes(requiredRole);
  };

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});

export default Guard;
