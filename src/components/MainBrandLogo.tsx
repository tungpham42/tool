import React, { useState } from "react";
import { Image as LucideImage } from "lucide-react";

interface MainBrandLogoProps {
  logoSrc: string; // Link ảnh logo
  mainDomain: string; // Ví dụ: 'soft.io.vn'
  altText?: string;
  size?: number; // Chiều cao logo
  dismissible?: boolean;
}

const MainBrandLogo: React.FC<MainBrandLogoProps> = ({
  logoSrc,
  mainDomain,
  altText = "Logo chính",
  size = 40,
  dismissible = false,
}) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="relative top-0 left-0 m-0 flex items-center bg-white rounded shadow p-2">
      <a
        href={`https://${mainDomain}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={logoSrc} alt={altText} height={size} className="me-2" />
      </a>
      {dismissible && (
        <button
          type="button"
          onClick={() => setShow(false)}
          className="btn-close ms-2"
          aria-label="Đóng logo brand"
          style={{ fontSize: size * 0.6 }}
        />
      )}
    </div>
  );
};

export default MainBrandLogo;
