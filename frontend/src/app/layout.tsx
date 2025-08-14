import './globals.css';
import AddonHeader from './shared/AddonHeader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="addon-min-h-screen addon-bg-gray-50 addon-text-gray-900" style={{ display:'flex', flexDirection:'column' }}>
          <AddonHeader />
          <div style={{ flex:1, paddingTop: '56px' }}>{children}</div>
        </div>
      </body>
    </html>
  );
}


