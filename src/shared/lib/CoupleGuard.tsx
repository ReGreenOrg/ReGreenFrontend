"use client";
import { useCoupleInfo } from "@/entities/user/lib/useCoupleInfo";
import { useMyInfo } from "@/entities/user/lib/userMyInfo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CoupleGuard = () => {
  const router = useRouter();
  const {
    data: myData,
    isSuccess: mySuccess,
    isError: myError,
    isPending: myPending,
  } = useMyInfo();

  const { data: coupleData, isSuccess: coupleSuccess } = useCoupleInfo();

  useEffect(() => {
    if (myError && !myPending) {
      router.push("/login");
      return;
    }

    if (mySuccess && myData.coupleId === null) {
      router.push("/couple");
      return;
    }

    if (mySuccess && coupleSuccess && coupleData?.data.name === null) {
      router.push("/couple/nickname");
      return;
    }
  }, [
    myError,
    myPending,
    mySuccess,
    myData?.coupleId,
    coupleSuccess,
    coupleData?.data.name,
    router,
  ]);

  return null;
};

export default CoupleGuard;
