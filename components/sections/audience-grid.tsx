import { useTranslations } from 'next-intl';

interface SectorCard {
  name: string;
  desc: string;
  color: string;
}

export function AudienceGrid() {
  const t = useTranslations('Index');

  const sectors: SectorCard[] = [
    { name: t('ag_1_name'), desc: t('ag_1_desc'), color: '#FEF3C7' },
    { name: t('ag_2_name'), desc: t('ag_2_desc'), color: '#EBF3FF' },
    { name: t('ag_3_name'), desc: t('ag_3_desc'), color: '#F3F4F6' },
    { name: t('ag_4_name'), desc: t('ag_4_desc'), color: '#FDF2F8' },
    { name: t('ag_5_name'), desc: t('ag_5_desc'), color: '#ECFDF5' },
    { name: t('ag_6_name'), desc: t('ag_6_desc'), color: '#EEF2FF' },
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <h2 className="text-[22px] font-bold text-gray-900 mb-8">
          {t('ag_title')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="rounded-[10px] border border-gray-200 hover:border-primary overflow-hidden cursor-pointer transition-colors duration-200"
            >
              <div
                style={{ backgroundColor: sector.color }}
                className="h-[140px] w-full"
              />
              <div className="p-4">
                <p className="text-sm font-bold text-gray-900 mb-1">
                  {sector.name}
                </p>
                <p className="text-xs text-gray-400 leading-snug">
                  {sector.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
