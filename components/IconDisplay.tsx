import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconDisplayProps extends LucideProps {
  name: string;
}

const IconDisplay: React.FC<IconDisplayProps> = ({ name, ...props }) => {
  // Access the icon component dynamically from the namespace import
  // The namespace import includes utility functions like createLucideIcon, so we cast to any first
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback icon if the name is invalid
    return <Icons.Globe {...props} />;
  }

  // Cast to ElementType to satisfy JSX requirements
  const ValidIcon = IconComponent as React.ElementType;

  return <ValidIcon {...props} />;
};

export default IconDisplay;