import { RichText } from './RichText'

export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-sky-400/12">
      <table className="w-full min-w-[540px] border-collapse text-right text-[0.88rem]">
        <thead>
          <tr className="bg-sky-400/[0.07] text-accent-300">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 font-bold">
                <RichText>{header}</RichText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-sky-400/10 bg-navy-900/40 transition hover:bg-sky-400/[0.04]"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-slate-300/90">
                  <RichText>{cell}</RichText>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
