// src/utils/lazyLoad.tsx
/**
 * Lazy loading utilities for code splitting and performance optimization
 */

import React, { Suspense, ComponentType, lazy } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner component
 */
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Full page loading component
 */
export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-light">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
  </div>
);

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}> = ({ width = '100%', height = '1rem', className = '', rounded = false }) => (
  <div
    className={`animate-pulse bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  />
);

/**
 * Chat list skeleton loader
 */
export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-2 p-2" aria-label="Loading chats">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3">
        <Skeleton width="48px" height="48px" rounded />
        <div className="flex-1">
          <Skeleton width="60%" height="1rem" className="mb-2" />
          <Skeleton width="80%" height="0.75rem" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Message list skeleton loader
 */
export const MessageListSkeleton: React.FC<{ count?: number }> = ({
  count = 10,
}) => (
  <div className="space-y-4 p-4" aria-label="Loading messages">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
      >
        <div
          className={`max-w-[70%] ${i % 2 === 0 ? 'items-start' : 'items-end'}`}
        >
          <Skeleton
            width={`${Math.random() * 40 + 30}%`}
            height="3rem"
            className="rounded-2xl"
          />
        </div>
      </div>
    ))}
  </div>
);

/**
 * HOC for lazy loading components with loading fallback
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);

  // Add preload method
  const LazyWithPreload = LazyComponent as typeof LazyComponent & {
    preload: () => Promise<{ default: T }>;
  };
  LazyWithPreload.preload = importFn;

  return LazyWithPreload;
}

/**
 * Create a lazy-loaded component with custom loading and error states
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ReactNode;
    preload?: boolean;
  } = {}
): React.FC<P> {
  const { fallback = <LoadingSpinner />, preload = false } = options;

  const LazyComponent = lazy(importFn);

  // Preload if requested
  if (preload) {
    importFn();
  }

  const WrappedComponent: React.FC<P> = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  );

  return WrappedComponent;
}

/**
 * Hook for preloading components on hover/focus
 */
export function usePreload(preloadFn: () => Promise<any>) {
  const preloaded = React.useRef(false);

  const preload = React.useCallback(() => {
    if (!preloaded.current) {
      preloaded.current = true;
      preloadFn();
    }
  }, [preloadFn]);

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}

/**
 * Intersection observer hook for lazy loading
 */
export function useLazyLoad<T extends HTMLElement>(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = React.useRef<T>(null);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || loaded.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !loaded.current) {
          loaded.current = true;
          callback();
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}

/**
 * Image lazy loading component
 */
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
}> = ({ src, alt, className = '', placeholder }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && placeholder}
      <img
        ref={imgRef}
        alt={alt}
        className={`${className} ${loaded ? '' : 'hidden'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </>
  );
};

/**
 * Defer component rendering until browser is idle
 */
export const DeferredRender: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(() => {
        setShouldRender(true);
      });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(() => setShouldRender(true), 1);
      return () => clearTimeout(id);
    }
  }, []);

  return <>{shouldRender ? children : fallback}</>;
};
