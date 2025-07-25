import { storyblokEditable } from '@storyblok/react/rsc';

interface GlobalDataProps {
  blok: {
    _uid: string;
    component: 'globaldata';
    name?: string;
    slogan?: string;
    email?: string;
    instagram?: string;
  };
}

const GlobalData = ({ blok }: GlobalDataProps) => (
  <div {...storyblokEditable(blok)} data-component="globaldata">
    {/* This component is used for global data management in Storyblok */}
    {/* It doesn't render anything visible - data is accessed via API */}
  </div>
);

export default GlobalData;
