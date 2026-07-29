const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

module.exports = {
  useRouter: () => mockRouter,
  usePathname: () => '/dashboard',
  useSearchParams: () => ({ get: () => null }),
};
