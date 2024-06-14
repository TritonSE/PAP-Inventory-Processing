import VSRModel from "src/models/vsr";

export const retrieveVSRs = async (
  search: string | undefined,
  status: string | undefined,
  incomeLevel: string | undefined,
  zipCodes: string[] | undefined,
  vsrIds: string[] | undefined,
) => {
  let vsrs = await VSRModel.aggregate([
    ...(search
      ? [
          {
            $match: { name: { $regex: new RegExp(search, "i") } },
          },
        ]
      : []),
    {
      $addFields: {
        statusOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "Received"] }, then: 1 },
              { case: { $eq: ["$status", "Approved"] }, then: 2 },
              { case: { $eq: ["$status", "Appointment Scheduled"] }, then: 3 },
              { case: { $eq: ["$status", "Complete"] }, then: 4 },
              { case: { $eq: ["$status", "No-show / Incomplete"] }, then: 5 },
              { case: { $eq: ["$status", "Archived"] }, then: 6 },
            ],
            default: 99,
          },
        },
      },
    },
    { $sort: { statusOrder: 1, dateReceived: -1 } },
  ]);

  if (vsrIds && vsrIds.length > 0) {
    const vsrIdsSet = new Set(vsrIds);
    vsrs = vsrs.filter((vsr) => vsrIdsSet.has(vsr._id.toString()));
  }

  if (status) {
    vsrs = vsrs.filter((vsr) => vsr.status === status);
  }

  if (incomeLevel) {
    const incomeMap: { [key: string]: string } = {
      "50000": "$50,001 and over",
      "25000": "$25,001 - $50,000",
      "12500": "$12,501 - $25,000",
      "0": "$12,500 and under",
    };

    vsrs = vsrs.filter((vsr) => {
      return vsr.incomeLevel === incomeMap[incomeLevel];
    });
  }

  if (zipCodes && zipCodes.length > 0) {
    vsrs = vsrs.filter((vsr) => zipCodes.includes(vsr.zipCode.toString()));
  }

  return vsrs;
};
