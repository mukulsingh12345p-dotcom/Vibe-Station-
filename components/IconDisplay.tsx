import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconDisplayProps extends LucideProps {
  name: string;
}

const IconDisplay: React.FC<IconDisplayProps> = ({ name, ...props }) => {
  // Access the icon component dynamically from the namespace import
  // @ts-ignore - Indexing into the namespace object
  const IconComponent = Icons[name as keyof typeof Icons];

  if (!IconComponent) {
    // Fallback icon if the name is invalid
    return <Icons.Globe {...props} />;
  }

  return <IconComponent {...props} />;
};

export default IconDisplay;
