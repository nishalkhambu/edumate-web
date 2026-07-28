import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => ({ get: () => null }),
}));

jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement('a', { href }, children);
  };
});
