import React from 'react';
import { ServiceTypeCode } from 'mma-sdk';
import { cn } from 'ui';

interface ServiceTypeBadgeProps {
  serviceType?: ServiceTypeCode;
}

/**
 * 복무형태 badge 컴포넌트
 * - industrial: 산업기능요원 (산기)
 * - professional: 전문연구요원/전문기능요원 (전문)
 */
export const ServiceTypeBadge: React.FC<ServiceTypeBadgeProps> = ({ serviceType }) => {
  if (!serviceType) {
    return null;
  }

  if (serviceType === 'industrial') {
    return (
      <span className={cn('badge-industrial')}>
        산기
      </span>
    );
  }

  if (serviceType === 'professional') {
    return (
      <span className={cn('badge-professional')}>
        전문
      </span>
    );
  }

  return null;
};

