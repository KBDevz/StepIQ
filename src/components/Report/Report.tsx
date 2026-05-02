import type { ReportData } from '../../types/report';
import CoverPage from './CoverPage';
import WhatYourNumberMeans from './WhatYourNumberMeans';
import YourTestData from './YourTestData';
import WhatYourEngineCanDo from './WhatYourEngineCanDo';
import YourTrainingZones from './YourTrainingZones';
import EightWeekProtocol from './EightWeekProtocol';
import BeyondTraining from './BeyondTraining';
import MeasureProgress from './MeasureProgress';
import WhatThisPlanBecomes from './WhatThisPlanBecomes';
import './report.css';

export default function Report({ data }: { data: ReportData }) {
  return (
    <div className="report-root">
      <CoverPage data={data} />
      <WhatYourNumberMeans data={data} />
      <YourTestData data={data} />
      <WhatYourEngineCanDo data={data} />
      <YourTrainingZones data={data} />
      <EightWeekProtocol data={data} />
      <BeyondTraining data={data} />
      <MeasureProgress data={data} />
      <WhatThisPlanBecomes data={data} />
    </div>
  );
}
