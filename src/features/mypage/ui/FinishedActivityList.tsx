"use client";
import { useCoupleInfo } from "@/entities/user/lib/useCoupleInfo";
import { useSubmitActivityList } from "@/features/certification/lib/useSubmitActivities";
import { SubmitActivitiesItem } from "@/features/certification/model/type";
import { SkeletonCard } from "@/widgets/activity/SkeletonCard";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const FinishedActivityList = () => {
  const { data } = useCoupleInfo();
  const heart = data?.data.ecoLovePoint || 0;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SubmitActivitiesItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const loader = useRef(null);

  const { data: submitData, isSuccess, isPending } = useSubmitActivityList({ page, limit: 10 });

  useEffect(() => {
    const current = loader.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isPending) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [hasNextPage, isPending]);

  useEffect(() => {
    if (!isPending && isSuccess && submitData) {
      const filtered = submitData.results.filter((item) => item.status === "APPROVED");
      setItems((prev) => [...prev, ...filtered]);
      if (filtered.length < 10) setHasNextPage(false);
    }
  }, [submitData]);

  return (
    <div className="flex flex-col bg-[#F1F2F5] min-h-screen p-4">
      {!isPending && items.length === 0 ? (
        <div className="text-center text-lg font-semibold text-[#777777] flex items-center justify-center h-full pb-48">
          아직 모인 활동이 없어요! <br />
          다양한 활동에 참여해보세요!
        </div>
      ) : (
        !isPending && (
          <div className="text-right text-md font-medium mb-2.5 mt-6">
            얻은 하트 : {heart !== 0 ? heart - 50 : 0}
          </div>
        )
      )}

      <div className="flex flex-col gap-4">
        {items.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white px-4 py-6 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Image
                width={56}
                height={56}
                src={
                  activity.title === "다회용 컵 이용하기"
                    ? "/icon/activity/cupIcon2.svg"
                    : activity.title === "중고 제품 나눔/구매 인증하기"
                    ? "/icon/activity/danguenIcon2.svg"
                    : activity.title === "플로깅 데이트하기"
                    ? "/icon/activity/trashIcon2.svg"
                    : "/icon/home/heartIcon.svg"
                }
                alt={activity.title}
              />
              <div className="flex flex-col">
                {activity.title.length > 10 ? (
                  <span className="text-lg font-semibold truncate max-w-[150px] md:max-w-[220px] block">
                    {activity.title}
                  </span>
                ) : (
                  <span className="text-lg font-semibold">{activity.title}</span>
                )}
                <span className="text-sm text-[#777777]">
                  신청일 : {activity.createdAt.split("T")[0]}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-[71px]">
              {activity && (
                <div className="flex items-center justify-between px-2 gap-1 text-ppink bg-[#FF387F1A] w-full py-0.75 rounded-[3.54px] text-sm font-medium">
                  <Image
                    width={16}
                    height={16}
                    src="/icon/home/heartIcon.svg"
                    alt="하트"
                    className="w-4 h-4"
                  />
                  +{activity.ecoLovePoint}
                </div>
              )}
              {activity && (
                <div className="flex items-center justify-between w-full gap-1 text-[#222222] bg-[#5151511A] px-2 py-0.75 rounded-[3.54px] text-sm font-medium">
                  <Image
                    width={16}
                    height={16}
                    src="/icon/home/calendarIcon.svg"
                    alt="보너스"
                    className="w-4 h-4"
                  />
                  +{activity.breakupBufferPoint}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 스켈레톤 3개 */}
        {isPending && Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)}

        {hasNextPage && <div ref={loader} className="h-6" />}
      </div>
    </div>
  );
};

export default FinishedActivityList;
