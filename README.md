# ReGreenFrontend

: 경기 볼런톤 환경보호 어플리케이션

---

### 프로젝트 폴더 구조 개요 (`FSD 기반`)

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 폴더를 구성하여 유지보수성과 확장성을 높였습니다.

```
src/
├── entities/          # 가장 기본이 되는 도메인 단위 (user, room 등)
│   └── [entity]/      # 각 엔티티별 model, ui 구성
│
├── features/          # 사용자 상호작용 중심 기능 단위
│   └── [feature]/     # 각 기능별 상태 관리(model), UI, 로직(lib)
│
├── widgets/           # 여러 feature를 조합한 단위 UI 블록
│   └── [widget]/      # 페이지 구성 단위 (Splash, Profile 등)
│
├── shared/            # 전역적으로 재사용되는 UI, 함수, 설정 등
│   ├── ui/            # 버튼, 모달 등 공통 UI 컴포넌트
│   ├── lib/           # 유틸 함수, 훅 등 공용 로직
│   └── config/        # 상수, 환경 설정 등
```

### 용도

- `entities`: 앱의 핵심 데이터 단위 (ex. user, room 등)
- `features`: 비즈니스 로직 및 사용자 인터랙션 중심 기능 (ex. 인증, 꾸미기 등)
- `widgets`: 하나 이상의 feature/엔티티를 조합한 컴포넌트 (ex. Splash, Onboarding 화면 등)
- `shared`: 프로젝트 전반에서 사용하는 공통 요소
