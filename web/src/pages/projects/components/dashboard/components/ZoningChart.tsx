import { Card, Title, ProgressBar } from "@tremor/react";

export default function ZoningChart({ plotsCount }: { plotsCount: number }) {
  const urbaineCount = plotsCount || 1; 
  const aUrbaniserCount = Math.max(0, plotsCount - 1);
  const total = urbaineCount + aUrbaniserCount;
  const urbainePercentage = total > 0 ? ((urbaineCount / total) * 100).toFixed(1) : "0.0";
  const aUrbaniserPercentage = total > 0 ? ((aUrbaniserCount / total) * 100).toFixed(1) : "0.0";

  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
        <Title className="text-sm font-semibold text-gray-900 dark:text-white">
          Zonage PLU
        </Title>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center">
        <ProgressBar
          value={Number(urbainePercentage)}
          color="blue"
          className="mt-2 [&>*]:bg-gray-100 [&>*]:dark:bg-white/10"
        />
        
        <ul role="list" className="mt-6 flex items-center justify-between">
          <li className="flex space-x-2.5">
            <span
              className="flex w-1 rounded-full bg-blue-500 dark:bg-blue-500"
              aria-hidden={true}
            />
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-500 dark:text-[#999999]">
                Zone Urbaine (U)
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {urbaineCount}{' '}
                <span className="font-normal text-gray-500 dark:text-[#999999] text-xs">
                  ({urbainePercentage}%)
                </span>
              </p>
            </div>
          </li>
          
          <li className="flex justify-end space-x-2.5">
            <div className="space-y-0.5">
              <p className="text-right text-xs font-medium text-gray-500 dark:text-[#999999]">
                À urbaniser (AU)
              </p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {aUrbaniserCount}{' '}
                <span className="font-normal text-gray-500 dark:text-[#999999] text-xs">
                  ({aUrbaniserPercentage}%)
                </span>
              </p>
            </div>
            <span
              className="flex w-1 rounded-full bg-gray-200 dark:bg-white/10"
              aria-hidden={true}
            />
          </li>
        </ul>
      </div>
    </Card>
  );
}