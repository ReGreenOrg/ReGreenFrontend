"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ActivityItem from "@/features/certification/ui/ActivityItem";
import ToastButton from "@/widgets/ToastButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useActivityList } from "@/entities/activity/lib/useActivityList";
import DummyActivityItem from "./DummyActivityItem";
import { httpNoThrow } from "@/shared/lib/http";
import CommonModal from "@/widgets/ComonModal";
import Loading from "@/widgets/Loading";
import Toast from "@/widgets/Toast";
// import { http } from "@/shared/lib/http";

const dummyActivities = [
  // {
  //   id: "1",
  //   iconSrc: "/icon/activity/cupIcon.svg",
  //   ready: true,
  //   type: "photo",
  //   label: "다회용 컵 사용하기",
  // },
  // {
  //   id: "2",
  //   iconSrc: "/icon/activity/danguenIcon.svg",
  //   ready: true,
  //   type: "photo",
  //   label: "중고 제품 나눔/구매 인증하기",
  // },
  // {
  //   id: "3",
  //   iconSrc: "/icon/activity/dateIcon.svg",
  //   ready: true,
  //   type: "photo",
  //   label: "플로깅 데이트 인증샷",
  // },
  {
    id: "4",
    iconSrc: "/icon/activity/plugIcon.svg",
    ready: false,
    type: "photo",
    label: "대기전력 차단하기",
  },
  {
    id: "5",
    iconSrc: "/icon/activity/bagIcon.svg",
    ready: false,
    type: "photo",
    label: "장바구니 사용하기",
  },
  {
    id: "6",
    iconSrc: "/icon/activity/trashIcon.svg",
    ready: false,
    type: "photo",
    label: "분리배출하기",
  },
  {
    id: "7",
    iconSrc: "/icon/activity/stairIcon.svg",
    ready: false,
    type: "photo",
    label: "계단 이용하기",
  },
  {
    id: "8",
    iconSrc: "/icon/activity/leftfoodIcon.svg",
    ready: false,
    type: "photo",
    label: "잔반 없이 먹기",
  },
  {
    id: "9",
    iconSrc: "/icon/activity/busIcon.svg",
    ready: false,
    type: "photo",
    label: "대중교통 이용하기",
  },
  {
    id: "10",
    iconSrc: "/icon/activity/reviewIcon.svg",
    ready: false,
    type: "link",
    label: "친환경 제품 리뷰 남기기",
  },
  {
    id: "11",
    iconSrc: "/icon/activity/bicyleIcon.svg",
    ready: false,
    type: "photo",
    label: "자전거 이용하기",
  },
  {
    id: "12",
    iconSrc: "/icon/activity/billIcon.svg",
    ready: false,
    type: "photo",
    label: "전기/가스 요금 줄이기 챌린지",
  },
  {
    id: "13",
    iconSrc: "/icon/activity/treeIcon.svg",
    ready: false,
    type: "photo",
    label: "가족/커플 나무심기",
  },
];

const ActivityList = () => {
  const [currentCheckedId, setCurrentCheckedId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: activities, isSuccess, isPending } = useActivityList();
  const router = useRouter();
  const notReadyActivities = dummyActivities;
  const [toast, setToast] = useState(false);

  const selected = activities?.find((a) => a.ecoVerificationId === currentCheckedId);

  const handleCheckboxClick = (id: string) => {
    setCurrentCheckedId((prev) => (prev === id ? "" : id));
  };

  const openFileDialog = (): Promise<{ file: File | null; previewUrl: string | null }> => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => resolve({ file, previewUrl: reader.result as string });
          reader.readAsDataURL(file);
        } else {
          resolve({ file: null, previewUrl: null });
        }
      };
      input.click();
    });
  };
  const MAX_FILE_SIZE = 8 * 1024 * 1024;

  const uploadPhoto = async (id: string) => {
    const { file } = await openFileDialog();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setModalOpen(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await httpNoThrow
        .post(`api/eco-verifications/${id}`, {
          body: formData,
        })
        .json<{
          code: number;
          statusCode?: number;
          message: string;
          data: { memberEcoVerificationId: string; status: string; s3ImageUrl: string };
        }>();

      setLoading(false);

      if (res.statusCode === 54001 || res.statusCode === 47003) {
        setModalOpen(true);
        return;
      }

      if (res.code === 2000) {
        const { memberEcoVerificationId, s3ImageUrl } = res.data;
        setToast(true);
        setTimeout(() => setToast(false), 2000);
        router.push(`/activity/${memberEcoVerificationId}?imageUrl=${s3ImageUrl}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ 인증 사진 업로드 요청 실패", error);
      setModalOpen(true);
    }
  };

  const handleCertificationClick = async () => {
    if (!selected) return;
    const { ecoVerificationId } = selected;
    setCurrentCheckedId("");
    await uploadPhoto(ecoVerificationId);
  };

  const TOAST_MESSAGE = selected ? (
    <div className="flex items-center justify-center gap-2">
      {/* {selected.type === "photo" && ( */}
      <>
        사진으로 인증하기
        <Image
          src="/icon/activity/certification/cameraIcon.svg"
          width={24}
          height={24}
          alt="카메라아이콘"
        />
      </>
      {/* )} */}
      {/* {selected.type === "link" && (
        <>
          링크로 인증하기
          <Image
            src="/icon/activity/certification/linkIcon.svg"
            width={24}
            height={24}
            alt="링크아이콘"
          />
        </>
      )} */}
    </div>
  ) : null;

  return (
    <div className="bg-white h-full overflow-y-scroll no-scrollbar relative">
      {toast && <Toast message="인증이 완료! 자정에 자동 검토되어 하트가 적립돼요!" />}
      {loading && <Loading />}
      {modalOpen && (
        <CommonModal
          isOpen={modalOpen}
          onlyCancel
          onCancel={() => setModalOpen(false)}
          message={
            <div className="font-bold px-5 py-5">이미지는 최대 5MB까지 업로드 가능합니다.</div>
          }
        />
      )}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full fixed bottom-20 left-1/2  transform -translate-x-1/2  justify-center gap-4 flex items-center z-50"
            >
              <div className="flex items-center justify-center  gap-2">
                <Image src="/icon/home/heartIcon.svg" width={24} height={24} alt="하트아이콘" />
                <span className="text-ppink font-bold">+{selected.breakupBufferPoint}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Image src="/icon/home/calendarIcon.svg" width={24} height={24} alt="달력아이콘" />
                <span className="font-bold">+{selected.breakupBufferPoint}</span>
              </div>
            </motion.div>
            <ToastButton message={TOAST_MESSAGE} onToastClick={handleCertificationClick} />
          </>
        )}
      </AnimatePresence>
      {isPending && (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}
      {isSuccess &&
        activities.map((activity) => (
          <ActivityItem
            key={activity.ecoVerificationId}
            ecoVerificationId={activity.ecoVerificationId}
            title={activity.title}
            ecoLovePoint={activity.ecoLovePoint}
            breakupBufferPoint={activity.breakupBufferPoint}
            imageUrl={
              activity.iconImageUrl || activity.title === "다회용 컵 이용하기"
                ? "/icon/activity/cupIcon.svg"
                : activity.title === "중고 제품 나눔/구매 인증하기"
                ? "/icon/activity/danguenIcon.svg"
                : activity.title === "플로깅 데이트하기"
                ? "/icon/activity/trashIcon.svg"
                : ""
            }
            currentCheckedId={currentCheckedId}
            onChecked={handleCheckboxClick}
          />
        ))}{" "}
      <div className="relative">
        <span className="absolute z-20 w-full text-center bottom-110  md:bottom-64  font-normal text-lg">
          업데이트 예정입니다.
        </span>
        {notReadyActivities.map((activity) => (
          <DummyActivityItem
            key={activity.id}
            ecoVerificationId={activity.id}
            imageUrl={activity.iconSrc}
            title={activity.label}
            {...activity}
          />
        ))}{" "}
      </div>
    </div>
  );
};

export default ActivityList;
