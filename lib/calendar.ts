import dayjs from "dayjs";
import jalaali from "jalaali-js";

export default function convertGaregrianToSolarWithTimeZone(currentDate: Date) {
  const date = dayjs(currentDate);

  const gDate = {
    gy: date.year(),
    gm: date.month() + 1, // month() is zero-based
    gd: date.date(),
  };

  const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
  return {
    day: jDate.jd,
    month: jDate.jm,
    year: jDate.jy,
  };
}
